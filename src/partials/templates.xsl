<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar-list">
	<xsl:for-each select="./*">
		<xsl:sort order="ascending" select="@type"/>
		<xsl:choose>
			<xsl:when test="@type = 'folder'">
				<div class="folder">
					<xsl:attribute name="data-id">
						<xsl:value-of select="@id"/>
					</xsl:attribute>
					<i class="icon-arrow_up"></i>
					<span><xsl:value-of select="@name"/></span>
					<div><div></div></div>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div class="item">
					<xsl:attribute name="data-path">
						<xsl:value-of select="@path"/>
					</xsl:attribute>
					<xsl:value-of select="@name"/>
				</div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="session">
	<div class="session">
		<div class="tracks-wrapper">
			<div class="tracks">
				<xsl:call-template name="track">
					<xsl:with-param name="node" select="//Tracks" />
				</xsl:call-template>
				<div class="space"></div>
			</div>
		</div>

		<div class="io-master">
			<xsl:call-template name="track">
				<xsl:with-param name="node" select="//IoMaster" />
			</xsl:call-template>
		</div>
	</div>
</xsl:template>

<xsl:template name="track">
	<xsl:param name="node" select="."/>
	<xsl:for-each select="$node/*">
		<div class="track-wrapper">
			<div class="track">
				<div class="title"><xsl:value-of select="@name"/></div>
				<div class="slots">
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="space"></div>
					<div class="status"></div>
				</div>
				<div class="io"></div>
				<div class="sends">
					<div class="knob" data-value="0" data-label="A"></div>
					<div class="knob" data-value="0" data-label="B"></div>
				</div>
				<div class="mixer">
					<div>
						<div class="pan-knob" data-value="0"><div></div></div>
						<xsl:if test="@name != 'Master'">
							<div class="toggle-button activator">
								<xsl:choose>
									<xsl:when test="@name = 'Reverb'">A</xsl:when>
									<xsl:when test="@name = 'Delay'">B</xsl:when>
									<xsl:otherwise><xsl:value-of select="position()"/></xsl:otherwise>
								</xsl:choose>
							</div>
							<div class="toggle-button solo">S</div>
							<div class="toggle-button record">&#9679;</div>
						</xsl:if>
					</div>
					<div class="volume" data-value="88"><div></div></div>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="device-sd">
	<div class="box-body sd-box">
		<div class="title">Sample Display</div>
		<div class="graph">
			<div class="sample"></div>
			<div class="values"></div>
		</div>
		<div class="controls">
			<div>
				<span>12Hz</span>
				<div class="knob" data-value="0"></div>
				<label title="Frequency">Freq</label>
			</div>
			<div>
				<span>32%</span>
				<div class="knob" data-value="0"></div>
				<label title="Response">Resp</label>
			</div>
			<div class="space"></div>
			<div>
				<span>12s</span>
				<div class="knob" data-value="0"></div>
				<label title="Attack">Att</label>
			</div>
			<div>
				<span>32s</span>
				<div class="knob" data-value="0"></div>
				<label title="Decay">Dec</label>
			</div>
			<div>
				<span>52dB</span>
				<div class="knob" data-value="0"></div>
				<label title="Sustain">Sust</label>
			</div>
			<div>
				<span>34s</span>
				<div class="knob" data-value="0"></div>
				<label title="Release">Rel</label>
			</div>
			<div>
				<span>90%</span>
				<div class="knob" data-value="0"></div>
				<label title="Volume">Vol</label>
			</div>
		</div>
	</div>
</xsl:template>

<xsl:template name="device-fr">
	<div class="box-body fr-box">
		<div class="title">Frequency Response</div>
		<div class="graph">
			<svg class="visualizer" viewBox="0 0 204 89" data-curve="fr">
				<line class="line" x1="0" y1="44.5" x2="204" y2="44.5"/>
				<line class="line" x1="31" y1="0" x2="31" y2="89"/>
				<line class="line" x1="102" y1="0" x2="102" y2="89"/>
				<line class="line" x1="173" y1="0" x2="173" y2="89"/>
				<path class="shape" />
				<circle class="handle filter" cx="110" cy="52" r="4" data-conn="frequence;5;199;response;5;89"></circle>
			</svg>
			<div class="values"></div>
		</div>
		<div class="controls">
			<div>
				<span>12Hz</span>
				<div class="knob frequence" data-value="0"></div>
				<label title="Frequency">Freq</label>
			</div>
			<div>
				<span>32%</span>
				<div class="knob response" data-value="0"></div>
				<label title="Response">Resp</label>
			</div>
			<div class="space"></div>
		</div>
	</div>
</xsl:template>

<xsl:template name="device-adsr">
	<div class="box-body adsr-box">
		<div class="title">ADSR Envelope</div>
		<div class="graph">
			<svg class="visualizer" viewBox="0 0 321 69" data-curve="adsr">
				<path class="shape"></path>
				<circle class="handle attack" cx="50" cy="5" r="4" data-conn="attack;5;107"></circle>
				<circle class="handle decsus" cx="135" cy="37" r="4" data-conn="decay;107;214;sustain;5;64"></circle>
				<circle class="handle release" cx="316" cy="64" r="4" data-conn="release;214;316"></circle>
			</svg>
			<div class="options">
				<div>Attack: <i class="icon-curve_bounce"></i></div>
				<div>Decay: <i class="icon-curve_decay_exponential"></i></div>
				<div>Release: <i class="icon-curve_decay_bounce"></i></div>
			</div>
			<div class="values"></div>
		</div>
		<div class="controls">
			<div>
				<span>12s</span>
				<div class="knob attack" data-value="0" data-conn="attack"></div>
				<label title="Attack">Att</label>
			</div>
			<div>
				<span>32s</span>
				<div class="knob decay" data-value="0" data-conn="decsus"></div>
				<label title="Decay">Dec</label>
			</div>
			<div>
				<span>52dB</span>
				<div class="knob sustain" data-value="0" data-conn="decsus"></div>
				<label title="Sustain">Sust</label>
			</div>
			<div>
				<span>34s</span>
				<div class="knob release" data-value="0" data-conn="release"></div>
				<label title="Release">Rel</label>
			</div>
			<div class="space"></div>
			<div>
				<span>4.00dB</span>
				<div class="knob" data-value="50"></div>
				<label title="Volume">Vol</label>
			</div>
		</div>
	</div>
</xsl:template>

<xsl:template name="rack-drumkit">
	<div class="rack-drumkit">
		<div class="box-body controls"></div>
		<div class="sequencer">
			<div class="instruments">
				<div class="head"></div>
				<div class="body">
					<div class="row">Kick</div>
					<div class="row">Snare</div>
					<div class="row">Hihat</div>
					<div class="row">Rim</div>
					<div class="row">Cowbell</div>
				</div>
			</div>
			<div class="steps">
				<div class="head">
					<div class="step"></div><div class="step active"></div><div class="step"></div><div class="step"></div>
					<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
				</div>
				<div class="body">
					
					<div class="row">
						<div class="step active"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step active"></div><div class="step"></div>
						<div class="step active"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					</div>
					<div class="row">
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step active"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step active"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					</div>
					<div class="row">
						<div class="step"></div><div class="step"></div><div class="step active"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step active"></div><div class="step"></div><div class="step active"></div>
					</div>
					<div class="row">
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step active"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					</div>
					<div class="row">
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
						<div class="step"></div><div class="step"></div><div class="step"></div><div class="step"></div>
					</div>

				</div>
			</div>
		</div>
	</div>
</xsl:template>

</xsl:stylesheet>
